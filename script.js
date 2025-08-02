function analizar() {
  const code = document.getElementById("codeInput").value;

  try {
    const propiedades = new Set();
    const regex = /msg(?:\.(payload|[\w]+))+?/g;
    let match;
    while ((match = regex.exec(code)) !== null) {
      propiedades.add(match[0]);
    }

    const resultado = Array.from(propiedades).sort().join("\n");
    document.getElementById("resultado").textContent = resultado || "No se encontraron propiedades en msg.";
  } catch (e) {
    document.getElementById("resultado").textContent = "Error al analizar: " + e.message;
  }
}