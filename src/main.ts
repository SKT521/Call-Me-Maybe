// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1iqZeR2m-VJqSDST6RlJZYBkRJ9610Lc",
  authDomain: "videocall-app-90fea.firebaseapp.com",
  projectId: "videocall-app-90fea",
  storageBucket: "videocall-app-90fea.appspot.com",
  messagingSenderId: "582513371891",
  appId: "1:582513371891:web:51a19800fb4038cd8de586",
  measurementId: "G-WNBJD29RZ0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};
//Global State
let pc = new RTCPeerConnection(servers);
let localStream: MediaStream | null = null;
let remoteStream: MediaStream | null = null;

const webcamButton = document.getElementById(
  "webcamButton"
) as HTMLButtonElement | null;
const webcamVideo = document.getElementById(
  "webcamVideo"
) as HTMLVideoElement | null;
const callButton = document.getElementById(
  "callButton"
) as HTMLButtonElement | null;
const callInput = document.getElementById(
  "callInput"
) as HTMLInputElement | null;
const answerButton = document.getElementById(
  "answerButton"
) as HTMLButtonElement | null;
const remoteVideo = document.getElementById(
  "remoteVideo"
) as HTMLVideoElement | null;
const hangupButton = document.getElementById(
  "hangupButton"
) as HTMLButtonElement | null;

// if (!webcamButton || !webcamVideo || !callButton || !callInput || !answerButton || !remoteVideo || !hangupButton) {
//   console.error("Some elements are missing in the DOM");
//   return;
// }
// 1. Setup media sources

// Input event listener for enabling/disabling the Answer button
callInput!.addEventListener("input", () => {
  answerButton!.disabled = !callInput!.value.trim(); // Disable if the input is empty
});

webcamButton!.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  remoteStream = new MediaStream();

  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream!);
  });

  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream!.addTrack(track);
    });
  };

  webcamVideo!.srcObject = localStream;
  remoteVideo!.srcObject = remoteStream;

  callButton!.disabled = false;
};
//2. Create an offer

callButton!.onclick = async () => {
  const callDoc = doc(collection(firestore, "calls"));
  const offerCandidates = collection(callDoc, "offerCandidates"); // Subcollection reference
  const answerCandidates = collection(callDoc, "answerCandidates"); // Subcollection reference

  callInput!.value = callDoc.id;

  //get candidate for caller, save to db

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      // Add ICE candidate to Firestore
      addDoc(offerCandidates, event.candidate.toJSON());
    }
  };

  //Make offer
  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await setDoc(callDoc, { offer });

  //Listen for remote server
  onSnapshot(callDoc, (snapshot) => {
    const data = snapshot.data();
    if (!pc.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  // When answerCandidates, add candidate to peer connection
  onSnapshot(offerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });
};

answerButton!.onclick = async () => {
  const callId = callInput!.value;
  const callDoc = doc(collection(firestore, "calls"));
  const answerCandidates = collection(callDoc, "answerCandidates"); // Subcollection reference

  pc = new RTCPeerConnection(servers);

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      // Add ICE candidate to Firestore
      addDoc(answerCandidates, event.candidate.toJSON());
    }
  };

  // Fetch the call data from Firestore
  const callDocSnapshot = await getDoc(callDoc);
  const callData: any = callDocSnapshot.data();
  // const callData = (await callDoc.get()).data();

  if (!callData) {
    console.error("No call data found!");
    alert("No call found with this ID. Please check the ID and try again.");
    return;
  }

  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await updateDoc(callDoc, { answer });

  // Listen for ICE candidates from the "offerCandidates" subcollection
  const offerCandidates = collection(callDoc, "offerCandidates");
  onSnapshot(offerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
};
