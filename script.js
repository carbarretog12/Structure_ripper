function analizar() {
  const codigo = document.getElementById('codigo').value;
  const resultado = document.getElementById('resultado');

  try {
    const estructuras = inferirEstructuras(codigo);
    resultado.textContent = JSON.stringify(estructuras, null, 2);
  } catch (e) {
    resultado.textContent = '❌ Error al analizar el código:\n' + e.message;
  }
}

function inferirEstructuras(codigo) {
  const estructuras = {
    msg: new Set(),
    context: new Set(),
    flow: new Set(),
    global: new Set()
  };

  const lineas = codigo.split('\n');

  for (const linea of lineas) {
    const trimmed = linea.trim();

    if (/msg\./.test(trimmed)) {
      const propiedades = [...trimmed.matchAll(/msg\.([a-zA-Z0-9_]+)/g)];
      propiedades.forEach(p => estructuras.msg.add(p[1]));
    }

    if (/context\./.test(trimmed)) {
      const propiedades = [...trimmed.matchAll(/context\.([a-zA-Z0-9_]+)/g)];
      propiedades.forEach(p => estructuras.context.add(p[1]));
    }

    if (/flow\./.test(trimmed)) {
      const propiedades = [...trimmed.matchAll(/flow\.([a-zA-Z0-9_]+)/g)];
      propiedades.forEach(p => estructuras.flow.add(p[1]));
    }

    if (/global\./.test(trimmed)) {
      const propiedades = [...trimmed.matchAll(/global\.([a-zA-Z0-9_]+)/g)];
      propiedades.forEach(p => estructuras.global.add(p[1]));
    }
  }

  // Convierte los sets a arrays para que se puedan mostrar
  return {
    msg: Array.from(estructuras.msg),
    context: Array.from(estructuras.context),
    flow: Array.from(estructuras.flow),
    global: Array.from(estructuras.global)
  };
}