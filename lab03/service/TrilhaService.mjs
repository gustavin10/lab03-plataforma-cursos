import { Trilha, TrilhaCurso } from '../model/Trilha.mjs';

const _trilhas = [];
const _trilhasCursos = [];

export class TrilhaService {
  listarTrilhas() {
    return [..._trilhas];
  }

  listarTrilhasCursos() {
    return [..._trilhasCursos].sort((a, b) => a.ordem - b.ordem);
  }

  buscarTrilhaPorId(id) {
    return _trilhas.find(t => t.id === id) ?? null;
  }

  salvarTrilha(dados) {
    const erros = Trilha.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    const trilha = new Trilha(dados.titulo, dados.descricao, dados.idCategoria);
    _trilhas.push(trilha);
    return trilha;
  }

  salvarTrilhaCurso(dados) {
    const erros = TrilhaCurso.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    const jaExiste = _trilhasCursos.find(
      tc => tc.idTrilha === dados.idTrilha && tc.idCurso === dados.idCurso
    );
    if (jaExiste) throw new Error('Este curso já foi adicionado a esta trilha.');
    const tc = new TrilhaCurso(dados.idTrilha, dados.idCurso, dados.ordem);
    _trilhasCursos.push(tc);
    return tc;
  }
}
