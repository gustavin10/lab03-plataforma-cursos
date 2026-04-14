import { Curso } from '../model/Curso.mjs';

const _cursos = [];

export class CursoService {
  listar() {
    return [..._cursos];
  }

  listarPorCategoria(idCategoria) {
    return _cursos.filter(c => c.idCategoria === idCategoria);
  }

  buscarPorId(id) {
    return _cursos.find(c => c.id === id) ?? null;
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
    _cursos.push(curso);
    return curso;
  }
}
