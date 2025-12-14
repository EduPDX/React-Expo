import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function verificar() {
    if (!email || !senha) {
      alert("Formulario Vazio");
      return;
    }

    if (email !== "teste@gmail.com") {
      alert("Email incorreto!");
      return;
    }

    if (senha !== "12345678") {
      alert("Senha errada!");
      return;
    }

    alert("Logado com Sucesso!");
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: "white",
    }}>
      <SafeAreaView 
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >

        <Text>{email}</Text>
        
        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          style={{
            width: "80%",
            borderWidth: 1,
            borderColor: "#bbb",
            padding: 10,
            borderRadius: 8,
            marginBottom: 15,
          }}
        />

        <TextInput
          placeholder='Senha'
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={{
            width: "80%",
            borderWidth: 1,
            borderColor: "#bbb",
            padding: 10,
            borderRadius: 8,
            marginBottom: 15,
          }}
        />

        <Button title="Logar" onPress={verificar} />
      </SafeAreaView>
    </View>
  );
}
