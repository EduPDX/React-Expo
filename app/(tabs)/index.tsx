import { getProximasConsultas, getTotalConsultas, getTotalPacientes, getUltimasConsultas, } from '@/database';
import { Consulta } from '@/types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function getStatusConsulta(data: string) {
  const [dia, mes, ano] = data.split('/').map(Number);
  const dataConsulta = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (dataConsulta.getTime() === hoje.getTime()) return 'HOJE';
  if (dataConsulta > hoje) return 'PRÓXIMA';
  return 'PASSADA';
}

function getCorStatus(status: string) {
  if (status === 'HOJE') return '#2563EB';
  if (status === 'PRÓXIMA') return '#16A34A';
  return '#9CA3AF';                           
}

/*COMPONENTE*/

export default function Dashboard() {
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [totalConsultas, setTotalConsultas] = useState(0);
  const [ultimasConsultas, setUltimasConsultas] = useState<Consulta[]>([]);
  const [proximasConsultas, setProximasConsultas] = useState<Consulta[]>([]);

  const carregarDados = () => {
    setTotalPacientes(getTotalPacientes());
    setTotalConsultas(getTotalConsultas());
    setUltimasConsultas(getUltimasConsultas());
    setProximasConsultas(getProximasConsultas());
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
      <SafeAreaView style={{ padding: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: '700', marginBottom: 20 }}>
          Dashboard
        </Text>

        {/*CARDS TOTAIS*/}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 16,
              elevation: 4,
            }}
          >
            <Text style={{ color: '#666' }}>Pacientes</Text>
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#4F46E5' }}>
              {totalPacientes}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 16,
              elevation: 4,
            }}
          >
            <Text style={{ color: '#666' }}>Consultas</Text>
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#16A34A' }}>
              {totalConsultas}
            </Text>
          </View>
        </View>

        {/*GRÁFICO*/}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            elevation: 4,
          }}
        >
          <Text style={{ fontWeight: '700', marginBottom: 10 }}>
            Visão Geral
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 100 }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View
                style={{
                  height: Math.min(totalPacientes * 10, 100),
                  width: 30,
                  backgroundColor: '#4F46E5',
                  borderRadius: 6,
                }}
              />
              <Text style={{ fontSize: 12 }}>Pacientes</Text>
            </View>

            <View style={{ flex: 1, alignItems: 'center' }}>
              <View
                style={{
                  height: Math.min(totalConsultas * 10, 100),
                  width: 30,
                  backgroundColor: '#16A34A',
                  borderRadius: 6,
                }}
              />
              <Text style={{ fontSize: 12 }}>Consultas</Text>
            </View>
          </View>
        </View>

        {/* ULTIMAS CONSULTAS */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            elevation: 4,
          }}
        >
          <Text style={{ fontWeight: '700', marginBottom: 10 }}>
            Últimas consultas
          </Text>

          {ultimasConsultas.length === 0 ? (
            <Text style={{ color: '#666' }}>Nenhuma consulta</Text>
          ) : (
            ultimasConsultas.map((c) => (
              <Text key={c.id} style={{ marginBottom: 4 }}>
                • {c.paciente_nome} — {c.data}
              </Text>
            ))
          )}
        </View>

        {/*PRÓXIMAS CONSULTAS*/}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            elevation: 4,
          }}
        >
          <Text style={{ fontWeight: '700', marginBottom: 10 }}>
            Consultas
          </Text>

          {proximasConsultas.length === 0 ? (
            <Text style={{ color: '#666' }}>
              Nenhuma consulta agendada
            </Text>
          ) : (
            proximasConsultas.map((c) => {
              const status = getStatusConsulta(c.data);
              const cor = getCorStatus(status);

              return (
                <View
                  key={c.id}
                  style={{
                    marginBottom: 8,
                    paddingBottom: 8,
                    borderBottomWidth: 1,
                    borderColor: '#F0F0F0',
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>
                    {c.paciente_nome}
                  </Text>

                  <Text style={{ color: '#666' }}>
                    {c.data}
                  </Text>

                  <Text style={{ color: cor, fontWeight: '600', fontSize: 12 }}>
                    {status}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
