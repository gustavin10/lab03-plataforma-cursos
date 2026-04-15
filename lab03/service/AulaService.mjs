import { Aula } from '../model/Aula.mjs';

const KEY = 'aulas';

export class AulaService {
  #listarRaw() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  listar() {
    return this.#listarRaw().sort((a, b) => a.ordem - b.ordem);
  }

  listarPorModulo(idModulo) {
    return this.#listarRaw()
      .filter(a => a.idModulo === idModulo)
      .sort((a, b) => a.ordem - b.ordem);
  }

  buscarPorId(id) {
    return this.#listarRaw().find(a => a.id === id) ?? null;
  }

  salvar(dados) {
    const erros = Aula.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    const aula = new Aula(
      dados.idModulo,
      dados.titulo,
      dados.tipoConteudo,
      dados.urlConteudo,
      dados.duracaoMinutos,
      dados.ordem
    );
    const lista = this.#listarRaw();
    lista.push(aula);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return aula;
  }
}
