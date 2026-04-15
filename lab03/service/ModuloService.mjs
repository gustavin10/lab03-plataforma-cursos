import { Modulo } from '../model/Modulo.mjs';

const KEY = 'modulos';

export class ModuloService {
  #listarRaw() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  listar() {
    return this.#listarRaw().sort((a, b) => a.ordem - b.ordem);
  }

  listarPorCurso(idCurso) {
    return this.#listarRaw()
      .filter(m => m.idCurso === idCurso)
      .sort((a, b) => a.ordem - b.ordem);
  }

  buscarPorId(id) {
    return this.#listarRaw().find(m => m.id === id) ?? null;
  }

  salvar(dados) {
    const erros = Modulo.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    const modulo = new Modulo(dados.idCurso, dados.titulo, dados.ordem);
    const lista = this.#listarRaw();
    lista.push(modulo);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return modulo;
  }
}
