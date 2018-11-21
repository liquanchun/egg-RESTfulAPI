module.exports = app => {
  const mysql = app.mysql;
  const UserSchema = new mysql.Schema({
    mobile: { type: String, unique: true, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    id: { type: Number, required: true }
  })
  return mysql.model('sys_user', UserSchema)
}
