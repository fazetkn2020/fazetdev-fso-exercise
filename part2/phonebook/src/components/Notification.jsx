const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  // type is either 'success' or 'error'
  const style = {
    color: type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

export default Notification
