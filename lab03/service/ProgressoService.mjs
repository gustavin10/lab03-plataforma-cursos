import { ProgressoAula } from '../model/ProgressoAula.mjs';
import { Certificado } from '../model/Certificado.mjs';

const _progressos = [];
const _certificados = [];

export class ProgressoService {
  listarProgressos() {
    return [..._progressos];
  }

  listarCertificados() {
    return [..._certificados];
  }

  buscarProgresso(idUsuario, idAula) {
    return _progressos.find(
      p => p.idUsuario === idUsuario && p.idAula === idAula
    ) ?? null;
  }

  buscarCertificado(idUsuario, idCurso) {
    return _certificados.find(
      c => c.idUsuario === idUsuario && c.idCurso === idCurso
    ) ?? null;
  }

  salvarProgresso(idUsuario, idAula) {
    if (!idUsuario) throw new Error('Selecione um usuário.');
    if (!idAula) throw new Error('Selecione uma aula.');
    if (this.buscarProgresso(idUsuario, idAula))
      throw new Error('Esta aula já foi marcada como concluída.');
    const progresso = new ProgressoAula(idUsuario, idAula);
    _progressos.push(progresso);
    return progresso;
  }

  verificarConclusao(idUsuario, idCurso, modulos, aulas, marcarMatriculaConcluida) {
    const modulosDoCurso = modulos.filter(m => m.idCurso === idCurso);
    const aulasDoCurso = aulas.filter(a =>
      modulosDoCurso.some(m => m.id === a.idModulo)
    );
    if (aulasDoCurso.length === 0) return null;

    const concluidas = _progressos.filter(
      p => p.idUsuario === idUsuario && aulasDoCurso.some(a => a.id === p.idAula)
    );

    if (concluidas.length === aulasDoCurso.length) {
      if (!this.buscarCertificado(idUsuario, idCurso)) {
        const cert = new Certificado(idUsuario, idCurso);
        _certificados.push(cert);
        if (typeof marcarMatriculaConcluida === 'function')
          marcarMatriculaConcluida(idUsuario, idCurso);
        return cert;
      }
    }
    return null;
  }
}
