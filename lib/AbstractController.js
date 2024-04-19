class AbstractController {
  constructor(table, includes = null) {
    this.table = table;
    this.includes = includes;
  }

  async findExec(where = null) {
    return await this.table.findAll({
      where: where,
      include: this.includes,
    });
  }

  async findOneExec(id) {
    if (typeof id != "object") {
      id = { id };
    }
    return await this.table.findOne({
      where: id,
      include: this.includes,
    });
  }

  async createExec(data) {
    return await this.table.create(data);
  }

  async updateExec(id, data) {
    const element = await this.findOneExec(id);
    const updates = await element.update(data, {
      where: { id },
    });
    await element.save();

    return updates;
  }

  async destroyExec(id) {
    return this.table.destroy({ where: { id } });
  }

  async find(req, res, Op) {
    const where = {};

    for (const attribute in this.table.rawAttributes) {
      if (req.query[attribute]) {
        if (this.table.rawAttributes[attribute].type.key == "INTEGER") {
          where[attribute] = req.query[attribute];
        } else {
          where[attribute] = { [Op.like]: "%" + req.query[attribute] + "%" };
        }
      }
    }

    const results = await this.findExec(where);

    if (this instanceof AbstractController) {
      return { data: results };
    }

    res.json({ data: results });
  }

  async findOne(req, res) {
    const result = await this.findOneExec(req.params.id);

    res.json({ data: result });
  }

  async create(req, res) {
    const result = await this.createExec(req.body);

    res.json({ data: result });
  }

  async update(req, res) {
    const result = await this.updateExec(req.params.id, req.body);

    res.json({ data: result });
  }

  async destroy(req, res) {
    const result = await this.destroyExec(req.params.id);

    res.json({ data: result });
  }
}

module.exports = { AbstractController };
