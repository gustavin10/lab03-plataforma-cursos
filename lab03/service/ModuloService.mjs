import { Modulo } from '../model/Modulo.mjs';

const _modulos = [];

export class ModuloService {
  listar() {
    return [..._modulos].sort((a, b) => a.ordem - b.ordem);
  }

  listarPorCurso(idCurso) {
    return _modulos.filter(m => m.idCurso === idCurso);
  }

  buscarPorId(id) {
    return _modulos.find(m => m.id === id) ?? null;
  }

  salvar(dados) {
    const erros = Modulo.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    const modulo = new Modulo(dados.idCurso, dados.titulo, dados.ordem);
    _modulos.push(modulo);
    return modulo;
  }
}
