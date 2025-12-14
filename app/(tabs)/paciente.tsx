import { createPaciente, deletePaciente, getPacientes } from '@/database';
import { Paciente } from '@/types';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [idade, setIdade] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  function verificar() {
    if (!nome || !telefone || !idade) {
      alert('Verifique o formulário.');
      return;
    }

    createPaciente({
      nome: nome.trim(),
      telefone: telefone.trim(),
      idade: parseInt(idade),
    });

    setPacientes(getPacientes());
    setNome('');
    setTelefone('');
    setIdade('');
  }

  useEffect(() => {
    setPacientes(getPacientes());
  }, []);

  const renderPacientes = ({ item }: { item: Paciente }) => (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.nome}</Text>
      <Text style={{ color: '#666', marginTop: 4 }}>
        Idade: {item.idade}
      </Text>
      <Text style={{ color: '#666' }}>Telefone: {item.telefone}</Text>

      <TouchableOpacity
        onPress={() => {
          deletePaciente(item.id!);
          setPacientes(getPacientes());
        }}
        style={{
          alignSelf: 'flex-end',
          marginTop: 10,
        }}
      >
        <Text style={{ color: '#E53935', fontWeight: '600' }}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        {/* Título */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 20,
          }}
        >
          Pacientes
        </Text>

        {/* Card Formulário */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 20,
            marginBottom: 25,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <TextInput
            placeholder="Nome do paciente"
            value={nome}
            onChangeText={setNome}
            style={{
              borderWidth: 1,
              borderColor: '#E0E0E0',
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
            }}
          />

          <TextInput
            placeholder="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            style={{
              borderWidth: 1,
              borderColor: '#E0E0E0',
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
            }}
          />

          <TextInput
            placeholder="Idade"
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: '#E0E0E0',
              borderRadius: 10,
              padding: 12,
              marginBottom: 15,
            }}
          />

          <TouchableOpacity
            onPress={verificar}
            style={{
              backgroundColor: '#4F46E5',
              padding: 14,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
              Cadastrar Paciente
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista */}
        <FlatList
          data={pacientes}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderPacientes}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#666' }}>
              Nenhum paciente cadastrado
            </Text>
          }
        />
      </SafeAreaView>
    </View>
  );
}
