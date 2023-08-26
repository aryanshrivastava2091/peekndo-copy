import { databases, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { ID } from 'appwrite';
import { create } from 'zustand'

interface BoardState{
board: Board;
getBoard:()=>void;
setBoardState: (board:Board)=>void;
updateTodoInDB: (todo:Todo,columnId:TypedColumn)=>void;
newTaskInput: string;
newTaskType: TypedColumn;
image: File | null;


searchString:string;
setSearchString:(searchString: string)=>void;

addTask:(todo:string, columnId:TypedColumn, image?:File| null)=>void;
deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn)=>void

setNewTaskInput:(input:string)=>void;
setNewTaskType:(columnId:TypedColumn)=>void;
setImage:(image:File | null)=>void;
}
export const useBoardStore = create<BoardState>((set,get) => ({
  board:{
    columns: new Map<TypedColumn,Column>()
  },
  newTaskInput:"",
  searchString:"",
  setSearchString:(searchString)=>set({searchString}),
  newTaskType:"todo",
  image:null,
 getBoard:async()=>{
     const board=await getTodosGroupedByColumn();
     set({board});

 },

 setBoardState: (board) => set({board}),

 deleteTask: async(taskIndex:number, todo:Todo, id:TypedColumn)=>{
   const newColumns = new Map(get().board.columns)

   newColumns.get(id)?.todos.splice(taskIndex,1)
   set({board: {columns: newColumns}});
   if(todo.image){
  await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
}
await databases.deleteDocument(
  process.env.NEXT_PUBLIC_DATABASE_ID!,
  process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
  todo.$id
)
},

setNewTaskInput: (input: string)=>({newTaskInput: input}),
setNewTaskType:(columnId:TypedColumn)=>set({newTaskType: columnId}),
setImage:(image: File|null)=>set({image}),


 updateTodoInDB: async(todo,columnId)=>{
await databases.updateDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
    todo.$id,{
        title:todo.title,
        status:columnId,
    }
)
 },


//  addTask:async(todo:string, columnId:TypedColumn, image?:File| null)=>{
//    let file: Image | undefined;
//    if(image){
//      const fileUploaded = await uploadImage(image);
//      if(fileUploaded /* && typeof fileUploaded ==='object'*/){
//       file={
//          bucketId:fileUploaded.bucketId,
//          fileId:fileUploaded.$id,
//        };
//      }
//    }

//    const {$id}=await databases.createDocument(
//      process.env.NEXT_PUBLIC_DATABASE_ID!,
//      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
//      ID.unique(),
//      {
// title: todo,
// status: columnId,
// ...(file && {image: JSON.stringify(file)}),
//      }
//    );
   


//   //  setTimeout({newTaskInput:""});
//    setTimeout(() => {
//     set({ newTaskInput: "" });
//   });
  
//    set((state)=>{
//      const newColumns = new Map(state.board.columns)
//      const newTodo: Todo ={
//       $id,
//       $createAt: new Date().toISOString(),
//       title: todo,
//       status: columnId,
//       ...(file && {image:JSON.stringify(file)}),
//      }
     
     
//      const column = newColumns.get(columnId)
//      if(!column){
//        newColumns.set(columnId,
//         {
//           id:columnId,
//           todos:[newTodo],
//         }); 
//      }
//      else{
//        newColumns.get(columnId)?.todos.push(newTodo)
//      }
//      return {board: {columns: newColumns}};
//    })
     
//     }
// }));

addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
  let file: Image | undefined;

  if (image) {
    const fileUploaded = await uploadImage(image);
    if (fileUploaded) {
      file = {
        bucketId: fileUploaded.bucketId,
        fileId: fileUploaded.$id,
      };
    }
  }

  const {$id} = await databases.createDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
    ID.unique(),
    {
      title: todo,
      status: columnId,
      ...(file && {image: JSON.stringify(file)}),
    }
  );

  setTimeout(() => {
    set({ newTaskInput: "" });
  });

  set((state) => {
    const newColumns = new Map(state.board.columns);
    const newTodo: Todo = {
      $id,
      $createAt: new Date().toISOString(),
      title: todo,
      status: columnId,
      image: file, // Assign the file object directly
    };

    const column = newColumns.get(columnId);
    if (!column) {
      newColumns.set(columnId, {
        id: columnId,
        todos: [newTodo],
      });
    } else {
      newColumns.get(columnId)?.todos.push(newTodo);
    }
    return {board: {columns: newColumns}};
  });
  setTimeout(() => {
    set({ newTaskInput: "" });
  });
}
}));