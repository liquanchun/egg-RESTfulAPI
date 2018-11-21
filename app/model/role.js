module.exports = app => {
  const mysql = app.mysql
  
  const RoleSchema = new mysql.Schema({
    name: { type: String, unique: true, required: true }
  })

  return mysql.model('Role', RoleSchema)
}