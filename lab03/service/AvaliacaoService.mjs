import { Avaliacao } from '../model/Avaliacao.mjs';

const _avaliacoes = [];

export class AvaliacaoService {
  listar() {
    return [..._avaliacoes];
  }

  buscarPorUsuarioECurso(idUsuario, idCurso) {
    return _avaliacoes.find(
      a => a.idUsuario === idUsuario && a.idCurso === idCurso
    ) ?? null;
  }

  salvar(dados) {
    const erros = Avaliacao.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    if (this.buscarPorUsuarioECurso(dados.idUsuario, dados.idCurso))
      throw new Error('Usuário já avaliou este curso.');
    const avaliacao = new Avaliacao(
      dados.idUsuario,
      dados.idCurso,
      dados.nota,
      dados.comentario
    );
    _avaliacoes.push(avaliacao);
    return avaliacao;
  }
}
