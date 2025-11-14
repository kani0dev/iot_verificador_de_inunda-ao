import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import AlertaInundacao from "./component/alert/AlertaInundacao";

const io_username = "kani0dev";
const io_key = "aio_ePLU82oOVU5AKuKRVkITAxgikJzK";

const io_feed_dist = "distanciachuva";
const io_feed_umid = "umidade";

export default function App() {
  const [distancia, setDistancia] = useState("--");
  const [umidade, setUmidade] = useState("--");

  const [historico, setHistorico] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  // Carrega o último valor de um feed
  async function loadLast(feed) {
    const res = await fetch(
      `https://io.adafruit.com/api/v2/${io_username}/feeds/${feed}/data?limit=10`,
      { headers: { "X-AIO-Key": io_key } }
    );

    const data = await res.json();
    return data[0]?.value || "--";
  }

  // Carrega múltiplos valores de um feed
  async function loadHistory(feed) {
    const res = await fetch(
      `https://io.adafruit.com/api/v2/${io_username}/feeds/${feed}/data?limit=10`,
      { headers: { "X-AIO-Key": io_key } }
    );

    return await res.json();
  }

  // Carrega distância + umidade (últimos dados)
  async function atualizarValores() {
    const d = await loadLast(io_feed_dist);
    const u = await loadLast(io_feed_umid);

    setDistancia(d);
    setUmidade(u);
  }

  // Histórico combinado
  async function atualizarHistorico() {
    const histDist = await loadHistory(io_feed_dist);
    const histUmid = await loadHistory(io_feed_umid);

    // Junta distância + umidade pelo mesmo índice
    const combinado = histDist.map((item, i) => ({
      distancia: item.value,
      umidade: histUmid[i] ? histUmid[i].value : "--",
      horario: item.created_at.substring(11, 19),
      id: item.id,
    }));
    console.log(combinado);
    
    setHistorico(combinado);
  }

  useEffect(() => {
    atualizarValores();
    atualizarHistorico();

    const interval = setInterval(() => {
      atualizarValores();
      atualizarHistorico();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <AlertaInundacao distancia={distancia} umidade={umidade}/>
      <Text style={styles.title}>Monitoramento — Distância + Umidade</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Distância atual (cm):</Text>
        <Text style={styles.value}>{distancia}</Text>
  
        <Text style={styles.label}>Umidade atual (%):</Text>
        <Text style={styles.value}>{umidade}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setMostrarHistorico(!mostrarHistorico)}
      >
        <Text style={styles.buttonText}>
          {mostrarHistorico ? "Esconder Histórico" : "Mostrar Histórico"}
        </Text>
      </TouchableOpacity>

      {mostrarHistorico && (
        <FlatList
          style={styles.list}
          data={historico}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>
                {item.horario} → Dist: {item.distancia} cm — Umid:{" "}
                {item.umidade}%
              </Text>
            </View>
          )}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  list: {
    marginTop: 10,
  },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
  },
});
