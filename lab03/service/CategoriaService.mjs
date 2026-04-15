import { Categoria } from '../model/Categoria.mjs';

const KEY = 'categorias';

export class CategoriaService {
  #listarRaw() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  listar() {
    return this.#listarRaw();
  }

  buscarPorId(id) {
    return this.#listarRaw().find(c => c.id === id) ?? null;
  }

  salvar(dados) {
    const erros = Categoria.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    const lista = this.#listarRaw();
    const duplicado = lista.find(
      c => c.nome.toLowerCase() === dados.nome.trim().toLowerCase()
    );
    if (duplicado) throw new Error('Já existe uma categoria com este nome.');
    const categoria = new Categoria(dados.nome, dados.descricao);
    lista.push(categoria);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return categoria;
  }
}
