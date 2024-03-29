import { useGetNotesQuery } from "./notesApiSlice"
import Note from "./Note"
import useAuth from "../../hooks/useAuth"
import PulseLoader from "react-spinners/PulseLoader"


const NotesList = () => {

  const {username, isManager, isAdmin} = useAuth()

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetNotesQuery ('noteList',{
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content

  if (isLoading) content = <PulseLoader color={"#FFF"}/>

  if (isError) {
    content = <p className={'errmsg'}> {error?.error} </p>
  }

  if (isSuccess) {

    const { ids, entities } = notes

    // Filtrado de notas segun perfil del usuario (en el caso de empleado solo pueden ver notas asignadas al usuario

    let filteredIds
    if (isAdmin || isManager) {
      filteredIds= [...ids]
    } else {
      filteredIds = ids.filter(noteId => entities[noteId].username === username)
    }

    const tableContent = ids?.length && filteredIds.map (noteId => <Note key={noteId} noteId={noteId} />)
    
    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
              <th scope="col" className="table__th note__edit">Ticket</th>
              <th scope="col" className="table__th note__edit">Estado</th>
              <th scope="col" className="table__th note__status">Titulo</th>
              <th scope="col" className="table__th note__created">Creada</th>
              <th scope="col" className="table__th note__username">Asigando a</th>
              <th scope="col" className="table__th note__created">Ubicacion</th>
              <th scope="col" className="table__th note__edit">Editar</th>
          </tr>
        </thead>
        <tbody>
            {tableContent}
        </tbody>
      </table>
    )

  }

  return content
  
}

export default NotesList