import { Matricula } from '../model/Matricula.mjs';

const _matriculas = [];

export class MatriculaService {
  listar() {
    return [..._matriculas];
  }

  buscarPorUsuarioECurso(idUsuario, idCurso) {
    return _matriculas.find(
      m => m.idUsuario === idUsuario && m.idCurso === idCurso
    ) ?? null;
  }

  salvar(idUsuario, idCurso) {
    if (!idUsuario) throw new Error('Selecione um usuário.');
    if (!idCurso) throw new Error('Selecione um curso.');
    if (this.buscarPorUsuarioECurso(idUsuario, idCurso))
      throw new Error('Usuário já está matriculado neste curso.');
    const matricula = new Matricula(idUsuario, idCurso);
    _matriculas.push(matricula);
    return matricula;
  }

  marcarConcluida(idUsuario, idCurso) {
    const mat = _matriculas.find(
      m => m.idUsuario === idUsuario && m.idCurso === idCurso
    );
    if (mat && !mat.dataConclusao) {
      mat.dataConclusao = new Date().toLocaleDateString('pt-BR');
    }
  }
}
