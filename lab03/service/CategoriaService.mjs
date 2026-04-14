import { Categoria } from '../model/Categoria.mjs';

const _categorias = [];

export class CategoriaService {
  listar() {
    return [..._categorias];
  }

  buscarPorId(id) {
    return _categorias.find(c => c.id === id) ?? null;
  }

  salvar(dados) {
    const erros = Categoria.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    const duplicado = _categorias.find(
      c => c.nome.toLowerCase() === dados.nome.trim().toLowerCase()
    );
    if (duplicado) throw new Error('Já existe uma categoria com este nome.');
    const categoria = new Categoria(dados.nome, dados.descricao);
    _categorias.push(categoria);
    return categoria;
  }
}
