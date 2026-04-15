import { ProgressoAula } from '../model/ProgressoAula.mjs';
import { Certificado } from '../model/Certificado.mjs';

const KEY_PROGRESSOS = 'progressos';
const KEY_CERTIFICADOS = 'certificados';

export class ProgressoService {
  #listarProgressosRaw() {
    return JSON.parse(localStorage.getItem(KEY_PROGRESSOS) ?? '[]');
  }

  #listarCertificadosRaw() {
    return JSON.parse(localStorage.getItem(KEY_CERTIFICADOS) ?? '[]');
  }

  listarProgressos() {
    return this.#listarProgressosRaw();
  }

  listarCertificados() {
    return this.#listarCertificadosRaw();
  }

  buscarProgresso(idUsuario, idAula) {
    return this.#listarProgressosRaw().find(
      p => p.idUsuario === idUsuario && p.idAula === idAula
    ) ?? null;
  }

  buscarCertificado(idUsuario, idCurso) {
    return this.#listarCertificadosRaw().find(
      c => c.idUsuario === idUsuario && c.idCurso === idCurso
    ) ?? null;
  }

  salvarProgresso(idUsuario, idAula) {
    if (!idUsuario) throw new Error('Selecione um usuário.');
    if (!idAula) throw new Error('Selecione uma aula.');
    if (this.buscarProgresso(idUsuario, idAula))
      throw new Error('Esta aula já foi marcada como concluída.');
    const progresso = new ProgressoAula(idUsuario, idAula);
    const lista = this.#listarProgressosRaw();
    lista.push(progresso);
    localStorage.setItem(KEY_PROGRESSOS, JSON.stringify(lista));
    return progresso;
  }

  verificarConclusao(idUsuario, idCurso, modulos, aulas, marcarMatriculaConcluida) {
    const modulosDoCurso = modulos.filter(m => m.idCurso === idCurso);
    const aulasDoCurso = aulas.filter(a =>
      modulosDoCurso.some(m => m.id === a.idModulo)
    );
    if (aulasDoCurso.length === 0) return null;

    const progressos = this.#listarProgressosRaw();
    const concluidas = progressos.filter(
      p => p.idUsuario === idUsuario && aulasDoCurso.some(a => a.id === p.idAula)
    );

    if (concluidas.length === aulasDoCurso.length) {
      if (!this.buscarCertificado(idUsuario, idCurso)) {
        const cert = new Certificado(idUsuario, idCurso);
        const listaCerts = this.#listarCertificadosRaw();
        listaCerts.push(cert);
        localStorage.setItem(KEY_CERTIFICADOS, JSON.stringify(listaCerts));
        if (typeof marcarMatriculaConcluida === 'function')
          marcarMatriculaConcluida(idUsuario, idCurso);
        return cert;
      }
    }
    return null;
  }
}
