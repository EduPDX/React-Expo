import { createPaciente, deletePaciente, getPacientes, updatePaciente, } from '@/database';
import { Paciente } from '@/types';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PacientesScreen() {
  // Cadastro
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [idade, setIdade] = useState('');

  // Lista
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  // Modal edição
  const [modalEditar, setModalEditar] = useState(false);
  const [pacienteEditando, setPacienteEditando] =
    useState<Paciente | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editIdade, setEditIdade] = useState('');

  useEffect(() => {
    atualizarLista();
  }, []);

  function atualizarLista() {
    setPacientes(getPacientes());
  }

  function cadastrarPaciente() {
    if (!nome || !telefone || !idade) {
      alert('Verifique o formulário.');
      return;
    }

    createPaciente({
      nome: nome.trim(),
      telefone: telefone.trim(),
      idade: parseInt(idade),
    });

    atualizarLista();
    setNome('');
    setTelefone('');
    setIdade('');
  }

  function abrirEdicao(paciente: Paciente) {
    setPacienteEditando(paciente);
    setEditNome(paciente.nome);
    setEditTelefone(paciente.telefone);
    setEditIdade(paciente.idade.toString());
    setModalEditar(true);
  }

  function salvarEdicao() {
    if (!pacienteEditando || !editNome || !editTelefone || !editIdade) {
      alert('Verifique o formulário.');
      return;
    }

    updatePaciente(pacienteEditando.id!, {
      nome: editNome.trim(),
      telefone: editTelefone.trim(),
      idade: parseInt(editIdade),
    });

    atualizarLista();
    fecharModal();
  }

  function fecharModal() {
    setModalEditar(false);
    setPacienteEditando(null);
    setEditNome('');
    setEditTelefone('');
    setEditIdade('');
  }

  function confirmarExclusao(id: number) {
    Alert.alert(
      'Excluir paciente',
      'Deseja realmente excluir este paciente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deletePaciente(id);
            atualizarLista();
          },
        },
      ]
    );
  }

  const renderPacientes = ({ item }: { item: Paciente }) => (
    <TouchableOpacity onPress={() => abrirEdicao(item)}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          padding: 16,
          marginBottom: 12,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700' }}>
          {item.nome}
        </Text>

        <View style={{ marginTop: 6 }}>
          <Text style={{ color: '#555' }}>
            Idade: {item.idade}
          </Text>
          <Text style={{ color: '#555' }}>
            Telefone: {item.telefone}
          </Text>
        </View>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            confirmarExclusao(item.id!);
          }}
          style={{ alignSelf: 'flex-end', marginTop: 10 }}
        >
          <Text style={{ color: '#E53935', fontWeight: '600' }}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 20,
          }}
        >
          Pacientes
        </Text>

        {/* FORMULÁRIO */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 20,
            marginBottom: 25,
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
            onPress={cadastrarPaciente}
            style={{
              backgroundColor: '#4F46E5',
              padding: 14,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>
              Cadastrar Paciente
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={pacientes}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderPacientes}
        />
      </SafeAreaView>

      {/* MODAL EDIÇÃO */}
      <Modal visible={modalEditar} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              margin: 20,
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 10,
              }}
            >
              Editar Paciente
            </Text>

            <TextInput
              value={editNome}
              onChangeText={setEditNome}
              style={{
                borderWidth: 1,
                borderColor: '#E0E0E0',
                borderRadius: 10,
                padding: 12,
                marginBottom: 12,
              }}
            />

            <TextInput
              value={editTelefone}
              onChangeText={setEditTelefone}
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
              value={editIdade}
              onChangeText={setEditIdade}
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
              onPress={salvarEdicao}
              style={{
                backgroundColor: '#4F46E5',
                padding: 14,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                Salvar Alterações
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={fecharModal}
              style={{
                marginTop: 10,
                alignItems: 'center',
              }}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
