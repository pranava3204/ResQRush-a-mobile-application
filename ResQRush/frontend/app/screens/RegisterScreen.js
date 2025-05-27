// import 'react-native-get-random-values'; // Polyfill for UUID
// import React, { useState } from "react";
// import { Picker } from "@react-native-picker/picker";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   StatusBar
// } from "react-native";
// import { db, auth } from "../firebase/firebaseConnection";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore"; // Import doc and setDoc
// import { v4 as uuidv4 } from "uuid";
// import Modal from 'react-native-modal';

// const RegisterScreen = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("driver"); // Default role
//   // For hospital role
//   const [hospitalId, setHospitalId] = useState(""); 
//   const [contactNumber, setContactNumber] = useState("")
//   const [zonalRegion, setZonalRegion] = useState(""); // For police role
//   const [name,setName] = useState("");
//   const [vehicleNumber,setVehicleNumber] = useState("");
//   const [driverId, setDriverId] = useState(uuidv4()); // Generate a unique DRIVER_ID
//   const [isModalVisible, setModalVisible] = useState(false);

//   const handleRegister = async () => {
//     if (!email || !password || !role) {
//       Alert.alert("Error", "Please fill in all fields.");
//       return;
//     }
  
//     // Validate role-specific fields
//     if (role === "hospital" && !hospitalId) {
//       Alert.alert("Error", "Please enter Hospital ID.");
//       return;
//     }
//     if (role === "police" && !zonalRegion) {
//       Alert.alert("Error", "Please enter Zonal Region.");
//       return;
//     }
//     if (role === "driver" && !name || !vehicleNumber) {
//       Alert.alert("Error", "Please enter name and Vehicle number.");
//       return;
//     }
  
//     try {
//       console.log("Registering user:", email, password, role);
  
//       // Create user with Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;
//       console.log("User registered successfully:", user.uid);
  
//       // Prepare user data for Firestore
//       const userData = {
//         uid: user.uid, // Store the Firebase Auth UID
//         email: email.trim(),
//         role: role.trim(),
//         createdAt: new Date().toISOString(),
//       };
  
//       // Add role-specific fields
//       if (role === "driver") {
//         userData.driverId = user.uid; // Store DRIVER_ID for drivers
//         userData.name = name;
//         userData.vehicleNumber = vehicleNumber;
//       } else if (role === "hospital") {
//         // Extract numeric part of the hospital ID
//         const numericHospitalId = hospitalId.replace(/\D/g, ""); // Remove non-numeric characters
//         userData.hospitalId = numericHospitalId; // Store only the numeric part
//       } else if (role === "police") {
//         userData.zonalRegion = zonalRegion.trim(); // Store zonalRegion for police
//       }
//       // Note: No additional fields needed for 'user' role
  
//       // Add user details to Firestore with the UID as the document ID
//       const userRef = doc(db, "users", user.uid); // Use UID as the document ID
//       await setDoc(userRef, userData); // Use setDoc instead of addDoc
//       console.log("User details added to Firestore with UID as document ID");
  
//       // If the user is a driver, create an entry in the ambulances collection
//       if (role === "driver") {
//         const ambulanceRef = doc(db, "ambulances", user.uid); // Use UID as the document ID
//         await setDoc(ambulanceRef, {
//           driverId: user.uid, // Store DRIVER_ID for drivers
//           latitude: 0, // Default latitude
//           longitude: 0, // Default longitude
//           timestamp: new Date().toISOString(),
//         });
//         console.log("Ambulance details added to Firestore with UID as document ID");
//       }
  
//       // Show success pop-up
//       setModalVisible(true);
//         setTimeout(() => {
//           setModalVisible(false);
//           navigation.navigate("Login");
//         }, 5000);

//     } catch (error) {
//       console.error("Registration error:", error);
//       Alert.alert("Error", error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#f5f5f5" />
//       <Text style={styles.title}>Register</Text>

//       {/* Role Selection Dropdown */}
//       <View style={styles.dropdownContainer}>
//         <Text style={styles.label}>Select Role:</Text>
//         <View style={styles.pickerWrapper}>
//           <Picker
//             selectedValue={role}
//             onValueChange={(itemValue) => setRole(itemValue)}
//             style={styles.picker}
//             dropdownIconColor="#000"
//           >
//             <Picker.Item label="Driver" value="driver" />
//             <Picker.Item label="Hospital" value="hospital" />
//             <Picker.Item label="Police" value="police" />
//             <Picker.Item label="User" value="user" />
//           </Picker>
//         </View>
//       </View>

//       <Modal isVisible={isModalVisible}>
//         <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
//           <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>
//             ✅ Success!
//           </Text>
//           <Text>User registered successfully.</Text>
//         </View>
//       </Modal>

//       {/* Common Fields */}
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TextInput
//           style={styles.input}
//           placeholder="Contact Number"
//           value={contactNumber}
//           onChangeText={setContactNumber}
//         />

//       {/* Hospital Role Fields */}
//       {role === "hospital" && (
//         <TextInput
//           style={styles.input}
//           placeholder="Hospital ID"
//           value={hospitalId}
//           onChangeText={setHospitalId}
//         />
//       )}

//       {/* User Role Fields */}
//       {role === "user" && (
//         <TextInput
//           style={styles.input}
//           placeholder="Name"
//           value={name}
//           onChangeText={setName}
//         />
//       )}

//       {/* User Role Fields */}
//       {role === "driver" && (
//         <>
//         <TextInput
//           style={styles.input}
//           placeholder="Name"
//           value={name}
//           onChangeText={setName}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Vehicle Number"
//           value={vehicleNumber}
//           onChangeText={setVehicleNumber}
//         />
//         </>
//       )}

//       {/* Police Role Fields */}
//       {role === "police" && (
//         <TextInput
//           style={styles.input}
//           placeholder="Zonal Region"
//           value={zonalRegion}
//           onChangeText={setZonalRegion}
//         />
//       )}

//       {/* Register Button */}
//       <TouchableOpacity style={styles.button} onPress={handleRegister}>
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>

//       {/* Login Link */}
//       <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//         <Text style={styles.link}>Already have an account? Login</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: '#f5f5f5'
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   dropdownContainer: {
//     width: "100%",
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   pickerWrapper: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     backgroundColor: "#fff",
//   },
//   input: {
//     width: "100%",
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: "#ef4444",
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 12,
//     width: "100%",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   link: {
//     marginTop: 15,
//     color: "#ef4444",
//     fontSize: 16,
//   },
// });

// export default RegisterScreen;

import 'react-native-get-random-values'; // Polyfill for UUID
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, auth } from "../firebase/firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Modal from 'react-native-modal';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("driver");
  const [hospitalId, setHospitalId] = useState(""); 
  const [contactNumber, setContactNumber] = useState("");
  const [zonalRegion, setZonalRegion] = useState("");
  const [name, setName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateContactNumber = (number) => {
    const numericValue = number.replace(/\D/g, '');
    setContactNumber(numericValue);
    return numericValue.length === 10;
  };

  const validateHospitalId = (id) => {
    const numericValue = id.replace(/\D/g, '');
    setHospitalId(numericValue);
    return numericValue.length === 13;
  };

  const checkHospitalIdExists = async (hospitalId) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("hospitalId", "==", hospitalId));
      const querySnapshot = await getDocs(q);
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking hospital ID:", error);
      return false;
    }
  };

  const handleRegister = async () => {
    // Common field validation
    if (!email || !password || !contactNumber) {
      Alert.alert("Error", "Please fill in all common fields (Email, Password, Contact Number).");
      return;
    }

    // Contact number validation
    if (!validateContactNumber(contactNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit contact number.");
      return;
    }
  
    // Role-specific field validation
    switch (role) {
      case "driver":
        if (!name || !vehicleNumber) {
          Alert.alert("Error", "Please enter Name and Vehicle Number for driver registration.");
          return;
        }
        break;
      case "hospital":
        if (!hospitalId) {
          Alert.alert("Error", "Please enter Hospital ID for hospital registration.");
          return;
        }
        if (!validateHospitalId(hospitalId)) {
          Alert.alert("Error", "Please enter a valid 13-digit Hospital ID.");
          return;
        }
        // Check if hospital ID already exists
        const hospitalExists = await checkHospitalIdExists(hospitalId.replace(/\D/g, ""));
        if (hospitalExists) {
          Alert.alert("Error", "This Hospital ID is already registered. Please use a different ID or contact support.");
          return;
        }
        break;
      case "police":
        if (!zonalRegion) {
          Alert.alert("Error", "Please enter Zonal Region for police registration.");
          return;
        }
        break;
      case "user":
        if (!name) {
          Alert.alert("Error", "Please enter Name for user registration.");
          return;
        }
        break;
      default:
        Alert.alert("Error", "Invalid role selected.");
        return;
    }
  
    try {
      console.log("Registering user:", email, role);
  
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User registered successfully:", user.uid);
  
      // Prepare user data for Firestore
      const userData = {
        uid: user.uid,
        email: email.trim(),
        role: role.trim(),
        contactNumber: contactNumber.trim(),
        createdAt: new Date().toISOString(),
      };
  
      // Add role-specific fields
      switch (role) {
        case "driver":
          userData.driverId = user.uid;
          userData.name = name.trim();
          userData.vehicleNumber = vehicleNumber.trim();
          break;
        case "hospital":
          userData.hospitalId = hospitalId.replace(/\D/g, "");
          break;
        case "police":
          userData.zonalRegion = zonalRegion.trim();
          break;
        case "user":
          userData.name = name.trim();
          break;
      }
  
      // Add user details to Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, userData);
      console.log("User details added to Firestore");
  
      // If the user is a driver, create an entry in the ambulances collection
      if (role === "driver") {
        const ambulanceRef = doc(db, "ambulances", user.uid);
        await setDoc(ambulanceRef, {
          driverId: user.uid,
          latitude: 0,
          longitude: 0,
          timestamp: new Date().toISOString(),
          vehicleNumber: vehicleNumber.trim(),
        });
        console.log("Ambulance details added to Firestore");
      }
  
      // Show success pop-up
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate("Login");
      }, 3000);

    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <Text style={styles.title}>Register</Text>

      {/* Role Selection Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Role:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={styles.picker}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Driver" value="driver" />
            <Picker.Item label="Hospital" value="hospital" />
            <Picker.Item label="Police" value="police" />
            <Picker.Item label="User" value="user" />
          </Picker>
        </View>
      </View>

      {/* Success Modal */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>✅ Success!</Text>
          <Text style={styles.modalText}>User registered successfully.</Text>
          <Text style={styles.modalText}>Redirecting to login...</Text>
        </View>
      </Modal>

      {/* Common Fields */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity 
          style={styles.eyeButton} 
          onPress={togglePasswordVisibility}
        >
          <Icon 
            name={showPassword ? 'eye-slash' : 'eye'} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        keyboardType="phone-pad"
        value={contactNumber}
        onChangeText={(text) => {
          const numericValue = text.replace(/\D/g, '');
          setContactNumber(numericValue);
        }}
        maxLength={10}
      />

      {/* Driver Role Fields */}
      {role === "driver" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Vehicle Number"
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
          />
        </>
      )}

      {/* Hospital Role Fields */}
      {role === "hospital" && (
        <TextInput
          style={styles.input}
          placeholder="Hospital ID"
          keyboardType="numeric"
          value={hospitalId}
          onChangeText={(text) => {
            const numericValue = text.replace(/\D/g, '');
            setHospitalId(numericValue);
          }}
          maxLength={13}
        />
      )}

      {/* Police Role Fields */}
      {role === "police" && (
        <TextInput
          style={styles.input}
          placeholder="Zonal Region"
          value={zonalRegion}
          onChangeText={setZonalRegion}
        />
      )}

      {/* User Role Fields */}
      {role === "user" && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      )}

      {/* Register Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#333',
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 60,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeButton: {
    padding: 15,
  },
  button: {
    backgroundColor: "#ef4444",
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    color: "#ef4444",
    fontSize: 16,
    fontWeight: '500',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default RegisterScreen;