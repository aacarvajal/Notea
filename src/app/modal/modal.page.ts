import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TodoservicioService } from '../servicios/todoservicio.service';
import { Router } from '@angular/router';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  //estas variables se recuperaran de tab1 para que se pueda actualizar la nota
  id: any;
  tittle: any;
  description: any;
  private todo: FormGroup;
  myloading: any;//muestra un cartel de cargando

  
  

  constructor(public modalcontroller: ModalController, private formBuilder: FormBuilder,
    private tss: TodoservicioService,
    private router: Router,
    public loadingController: LoadingController, public navparams: NavParams) {

    this.navparams.get('id');

    this.todo = this.formBuilder.group({

      title: [this.navparams.get('tittle'), Validators.required],
      description: [this.navparams.get('description')],

    });
  }

  ngOnInit() {
  }

  //este metodo se encarga de deshabilitar el modal
  dismiss() {
    this.modalcontroller.dismiss();

  }

  //se ejecuta en el onsubmit

  actualizarFormulario() {

    let data = {
      title: this.todo.get("title").value,//se recoge el valor del titulo
      description: this.todo.get("description").value//se recoge el valor de descripcion
    }; 

    //console.log("Id insertado", this.id)
    //se muestra el cartel de cargando
    this.myloading = this.presentLoading();

    //se llama al metodo de actualizar del servicio ToDo, al que se le pasaran los datos que se van a modificar
    this.tss.actualizaNota(this.id, data)

      .then((docRef) => {

        //se cierra el cartel de cargando
        this.loadingController.dismiss();

        this.dismiss();
      })
      .catch((error) => {

        //muestra un mensaje de error
        console.error("Error al insertar: ", error);
        //se cierra el cartel de cargando
        this.loadingController.dismiss();

      });
  }

  //ejercuta un cartel de guardando
  async presentLoading() {
    this.myloading = await this.loadingController.create({
      message: 'Guardando'
    });
    return await this.myloading.present();
  }
}
