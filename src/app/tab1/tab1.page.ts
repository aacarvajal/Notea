import { Component, ViewChild } from '@angular/core';
import { TodoservicioService } from '../servicios/todoservicio.service';
import { LoadingController, NavController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { ModalPage } from '../modal/modal.page';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('dynamicList') dynamicList;
  listado = [];
  listadoPanel = [];

  constructor(private todoS: TodoservicioService,
    public loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController,
    public modalController: ModalController) {

    this.initializeItems();

  }

  //Analizar el ciclo de vida de los componentes: justo cuando se hace activa
  ionViewDidEnter() {//es igual que el ngInit
    this.presentLoading("Cargando");//texto de el loading
    this.todoS.leeNotas()
      .subscribe((querySnapshot) => {
        this.listado = [];
        this.delete();
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          this.listado.push({ id: doc.id, ...doc.data() });
        });
        //console.log(this.listado);
        this.listadoPanel = this.listado;
        this.loadingController.dismiss();
      });
  }

  //Esta función es llamada por el componente Refresher de IONIC v4
  doRefresh(refresher) {
    this.todoS.leeNotas()
      .subscribe(querySnapshot => {
        this.listado = [];
        this.delete(); //Es un hack para solucionar un bug con el refresher y las listas
        // dinámicas (ngFor) 
        querySnapshot.forEach((doc) => {
          //console.log(doc.data());//.data devuelve un objeto
          //paydata devuelve un objeto de un array
          this.listado.push({ id: doc.id, ...doc.data() });//push=añadir elementos a un array
          //los 3 puntos en typescript convierte un objeto a json
        });
        this.listadoPanel = this.listado;
        refresher.target.complete();//para que se cierre el refresh
      });
  }

  async delete() { //para solucionar el tema de list-items-sliding con ngfor
    await this.dynamicList.closeSlidingItems();
  }

  async presentLoading(msg) {
    let myloading = await this.loadingController.create({
      message: msg
    });
    return await myloading.present();
  }

  //edita una nota ya creada
  async editarNota(id: any, tittle: any, description: any) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: { id, tittle, description }
    });

    //actualiza el tab1 que mostrara la nota modificada
    modal.onDidDismiss()
      .then(() => {//se ejecuta cuando tiene exito

        this.ionViewDidEnter();

      });

    await modal.present();

  }

  irNueva() {
    console.log("Ir a Nueva")
    this.router.navigateByUrl('/tabs/(tab2:tab2)');
  }

  borrarNota(id) {

    this.todoS.borraNota(id);

  }

  async presentAlertConfirm(id: any) {
    const alert = await this.alertController.create({
      header: '!Atención!',
      message: '¿Quiere borrar la nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',

        }, {
          text: 'Aceptar',
          handler: () => {
            this.borrarNota(id);
            this.ionViewDidEnter();//refresca automaticamente despues de borrar
            //console.log('Confirmar');
          }
        }
      ]
    });

    await alert.present();
  }


  //inicializa el array de filtrar
  initializeItems(): void {

    this.listado = this.listadoPanel;

  }

  getFilteredItem($event) {
    // resetea todos los objetos y pone el array de nuevo con todos los elementos
    this.initializeItems();

    // Establece el valor del search bar
    const val = $event.target.value;

    // si el valor esta vacio no filtra 
    if (val && val.trim() != '') {
      this.listadoPanel = this.listado.filter((item) => {
        console.log(item.title);
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }


}
