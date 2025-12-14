import { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const [nome, setNome] = useState("");
  const [telefone,setTelefone] = useState("");
  const [idade, setIdade] = useState("");

  function verificar() {
    if (!nome || !telefone || !idade) {
      alert("Formulario Vazio");
      return;
    }

    alert("Cadastrado com Sucesso!");
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
        
        <TextInput
          placeholder='Nome'
          value={nome}
          onChangeText={setNome}
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
          placeholder='Telefone'
          value={telefone}
          onChangeText={setTelefone}
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
          placeholder='Idade'
          value={idade}
          onChangeText={setIdade}
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

        <Button title="Cadastrar" onPress={verificar} />
      </SafeAreaView>
    </View>
  );
}
