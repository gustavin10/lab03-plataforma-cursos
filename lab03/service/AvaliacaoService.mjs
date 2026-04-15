import { Avaliacao } from '../model/Avaliacao.mjs';

const KEY = 'avaliacoes';

export class AvaliacaoService {
  #listarRaw() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  listar() {
    return this.#listarRaw();
  }

  buscarPorUsuarioECurso(idUsuario, idCurso) {
    return this.#listarRaw().find(
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
    const lista = this.#listarRaw();
    lista.push(avaliacao);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return avaliacao;
  }
}
