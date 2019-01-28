import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoservicioService {

  //es un servicio que se podra usar en cualquier componente
  myCollection: any;

  constructor(private fireStore: AngularFirestore) {
    /* Crea una referencia a la colección 'todo' que empleamos para realizar las
   operaciones CRUD*/
    this.myCollection =
      fireStore.collection<any>(environment.firebaseconfig.todoColeccion);

  }



  /*
  Recibe un objeto y lo guarda como un documento nuevo en la colección 'todo'
  Devuelve un Promise
  */
  agregaNota(datos) {
    return this.myCollection.add(datos);
  }
  /*
  Recupera todos los documentos (notas) de la colección 'todo'
  Devuelve un Observable
  */
  leeNotas() {
    return this.myCollection.get();
  }
  /*
  Recupera todos los campos de un documento concreto identificado por la clave id de la
 colección 'todo'
  Devuelve un Observable
  */
  leeNota(id) {
    return this.myCollection.doc(id).get();
  }
  /*
  Actualiza los campos (sobreescribe y añade) determinados por el objeto data en el
 documento identificado por id de la colección 'todo'
  Devuelve un Promise
  */
  actualizaNota(id, data) {
    return this.myCollection.doc(id).set(data);
  }
  /* Sin desarrollar aún */
  leeNotasegunCriterio() {
    /*Aquí podriamos insertar una selección con where: .where("capital", "==",
   true).get() */
  }
  /*
  Elimina el documento identificado por id de la colección 'todo'
  Devuelve un Promise
  */
  borraNota(id) {

    return this.myCollection.doc(id).delete();

  }

}
