import { createConsulta, deleteConsulta, getConsultas, getPacientes, updateConsulta, } from '@/database';
import { Consulta, Paciente } from '@/types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] =
    useState<Paciente | null>(null);

  const [modalPacientes, setModalPacientes] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [consultaEditando, setConsultaEditando] =
    useState<Consulta | null>(null);

  function formatarData(text: string) {
    return text
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1/$2')
      .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
      .slice(0, 10);
  }

  function verificar() {
    if (!pacienteSelecionado || !data || !descricao) {
      Alert.alert('Atenção', 'Verifique o formulário.');
      return;
    }

    createConsulta({
      paciente_id: pacienteSelecionado.id!,
      data,
      descricao,
    });

    setConsultas(getConsultas());
    setPacienteSelecionado(null);
    setData('');
    setDescricao('');
  }

  function salvarEdicao() {
    if (!consultaEditando) return;

    updateConsulta(consultaEditando.id!, {
      paciente_id: consultaEditando.paciente_id,
      data: consultaEditando.data,
      descricao: consultaEditando.descricao,
    });

    fecharModalEdicao();
    setConsultas(getConsultas());
  }

  function fecharModalEdicao() {
    setModalEditar(false);
    setConsultaEditando(null);
  }

  const carregarConsultas = () => {
    setConsultas(getConsultas());
    setPacientes(getPacientes());
  };

  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [])
  );

  useEffect(() => {
    carregarConsultas();
  }, []);

  const renderConsulta = ({ item }: { item: Consulta }) => (
    <TouchableOpacity
      onPress={() => {
        setConsultaEditando(item);
        setModalEditar(true);
      }}
      style={{
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 15,
        marginBottom: 12,
        elevation: 3,
      }}
    >
      <Text style={{ fontWeight: '700', fontSize: 16 }}>
        {item.paciente_nome}
      </Text>

      <Text style={{ color: '#555', marginTop: 4 }}>📅 {item.data}</Text>

      <Text style={{ color: '#666', marginTop: 6 }}>
        {item.descricao}
      </Text>

      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            'Excluir consulta',
            'Tem certeza que deseja excluir esta consulta?',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Excluir',
                style: 'destructive',
                onPress: () => {
                  deleteConsulta(item.id!);
                  setConsultas(getConsultas());
                },
              },
            ]
          )
        }
        style={{ alignSelf: 'flex-end', marginTop: 10 }}
      >
        <Text style={{ color: '#E53935', fontWeight: '600' }}>
          Excluir
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 20 }}>
          Consultas
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
          <TouchableOpacity
            onPress={() => setModalPacientes(true)}
            style={{
              borderWidth: 1,
              borderColor: '#E0E0E0',
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <Text>
              {pacienteSelecionado
                ? `Paciente: ${pacienteSelecionado.nome}`
                : 'Selecionar paciente'}
            </Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Data (DD/MM/AAAA)"
            keyboardType="numeric"
            value={data}
            onChangeText={(t) => setData(formatarData(t))}
            style={{
              borderWidth: 1,
              borderColor: '#E0E0E0',
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
            }}
          />

          <TextInput
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            style={{
              borderWidth: 1,
              borderColor: '#E0E0E0',
              borderRadius: 10,
              padding: 12,
              minHeight: 70,
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
            <Text style={{ color: '#fff', fontWeight: '600' }}>
              Cadastrar Consulta
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={consultas}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderConsulta}
        />

        {/* MODAL PACIENTES */}
        <Modal visible={modalPacientes} transparent animationType="slide">
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
                maxHeight: '80%',
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: '700', marginBottom: 10 }}
              >
                Selecione um paciente
              </Text>

              <FlatList
                data={pacientes}
                keyExtractor={(item) => item.id!.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setPacienteSelecionado(item);
                      setModalPacientes(false);
                    }}
                    style={{ padding: 12 }}
                  >
                    <Text>{item.nome}</Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity
                onPress={() => setModalPacientes(false)}
                style={{
                  marginTop: 15,
                  padding: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                }}
              >
                <Text style={{ fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* MODAL EDITAR CONSULTA */}
        <Modal
          visible={modalEditar}
          transparent
          animationType="slide"
          onRequestClose={fecharModalEdicao}
        >
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
                style={{ fontSize: 18, fontWeight: '700', marginBottom: 10 }}
              >
                Editar Consulta
              </Text>

              <TextInput
                value={consultaEditando?.data}
                keyboardType="numeric"
                onChangeText={(t) =>
                  setConsultaEditando((prev) =>
                    prev ? { ...prev, data: formatarData(t) } : prev
                  )
                }
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 12,
                }}
              />

              <TextInput
                value={consultaEditando?.descricao}
                onChangeText={(t) =>
                  setConsultaEditando((prev) =>
                    prev ? { ...prev, descricao: t } : prev
                  )
                }
                multiline
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 10,
                  padding: 12,
                  minHeight: 70,
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
                onPress={fecharModalEdicao}
                style={{
                  marginTop: 10,
                  padding: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
