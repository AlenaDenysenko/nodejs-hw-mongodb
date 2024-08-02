import { Contact } from '../models/contact.js'

const getAllContacts = async () => {
  return await Contact.find()
}

const getContactById = async (id) => {
  return await Contact.findById(id)
}

export { getAllContacts, getContactById }

