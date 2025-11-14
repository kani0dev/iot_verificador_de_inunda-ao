import { View, Text, StyleSheet } from "react-native";

export default function AlertaInundacao({ distancia, umidade }) {
  const dist = parseFloat(distancia);
  const umi = parseFloat(umidade);

  let status = "normal";
  let titulo = "✓ Sistema Seguro";
  let mensagem = "";
  let estilo = styles.ok;

  if (!isNaN(umi) && !isNaN(dist)) {

    // === 3. INUNDAÇÃO (PERIGO) ===
    if (umi > 90 && dist < 10) {
      status = "perigo";
      titulo = "⚠ INUNDAÇÃO DETECTADA!";
      mensagem = "A água está muito próxima do sensor! ATENÇÃO!";
      estilo = styles.perigo;
    }

    // === 1. CHOVENDO (NORMAL) ===
    else if (umi > 60 && dist >= 10) {
      status = "chovendo";
      titulo = "🌧 Chovendo";
      mensagem = "Chuva detectada, mas sem risco de inundação.";
      estilo = styles.normal;
    }

    // === 2. NÃO ESTÁ CHOVENDO (NORMAL) ===
    else if (umi >= 50 && umi <= 60) {
      status = "seco";
      titulo = "☁ Sem chuva";
      mensagem = "Nenhuma chuva detectada atualmente.";
      estilo = styles.normal;
    }
  }

  return (
    <View style={[styles.card, estilo]}>
      <Text style={styles.title}>{titulo}</Text>

      <Text style={styles.info}>Distância: {distancia} cm</Text>
      <Text style={styles.info}>Umidade: {umidade}%</Text>

      {mensagem !== "" && <Text style={styles.msg}>{mensagem}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    elevation: 4,
  },

  // Estados visuais:
  ok: {
    backgroundColor: "#4CAF50", // verde
  },
  normal: {
    backgroundColor: "#1E88E5", // azul
  },
  perigo: {
    backgroundColor: "#ff4d4d", // vermelho
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  msg: {
    marginTop: 10,
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});
