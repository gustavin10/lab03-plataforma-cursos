import { Aula } from '../model/Aula.mjs';

const _aulas = [];

export class AulaService {
  listar() {
    return [..._aulas].sort((a, b) => a.ordem - b.ordem);
  }

  listarPorModulo(idModulo) {
    return _aulas.filter(a => a.idModulo === idModulo);
  }

  buscarPorId(id) {
    return _aulas.find(a => a.id === id) ?? null;
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
    _aulas.push(aula);
    return aula;
  }
}
