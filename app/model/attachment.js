module.exports = app => {
  const mysql = app.mysql;

  const AttachmentSchema = new mysql.Schema({
    extname: { type: String },
    url: { type: String },
    filename: { type: String },
    extra: {  type: String  },
    createdAt: { type: Date, default: Date.now }
  });
  
  return mysql.model('Attachment', AttachmentSchema);

};