# Call Me Maybe

## Overview

*Call Me Maybe* is an video calling app which leverages the power of **WebRTC** and **Firebase** to enable seamless real-time communication. This application allows users to connect with friends, family, or colleagues through high-quality video and audio calls, all within a user-friendly interface.

## Features

- **Real-Time Communication**: Implemented WebRTC for peer-to-peer video calls, enabling users to connect effortlessly.
- **Firebase Integration**: Utilized Firestore for managing call sessions and ICE candidates, ensuring reliable connection establishment.
- **Modern Frontend Development**: Built the frontend using React with TypeScript, emphasizing type safety and robust component architecture.
- **Dynamic Call Management**: Includes advanced features such as ICE candidate handling for improved connection reliability.

## Technologies Used

- **Frontend**: 
  - React
  - TypeScript
- **Backend**: 
  - Firebase (Firestore for data management)
- **Communication**: 
  - WebRTC for real-time video and audio calls

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/skt521/video-call-app.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd video-call-app
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and go to `http://localhost:3000` to view the app.

## Usage

1. Click the "Start Webcam" button to initiate your webcam.
2. Use the "Call" button to create a new call and generate a unique call ID.
3. Share the call ID with others so they can join the call using the "Join a Call" input.
4. Enjoy seamless video communication!

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **WebRTC**: For enabling real-time peer-to-peer communication.
- **Firebase**: For providing a scalable and efficient backend solution.

---

Feel free to reach out if you have any questions or feedback!
