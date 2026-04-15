import { Curso } from '../model/Curso.mjs';

const KEY = 'cursos';

export class CursoService {
  #listarRaw() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  listar() {
    return this.#listarRaw();
  }

  listarPorCategoria(idCategoria) {
    return this.#listarRaw().filter(c => c.idCategoria === idCategoria);
  }

  buscarPorId(id) {
    return this.#listarRaw().find(c => c.id === id) ?? null;
  }

  salvar(dados) {
    const erros = Curso.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    const curso = new Curso(
      dados.titulo,
      dados.descricao,
      dados.idInstrutor,
      dados.idCategoria,
      dados.nivel,
      dados.totalAulas,
      dados.totalHoras
    );
    const lista = this.#listarRaw();
    lista.push(curso);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return curso;
  }
}
