import { Component, OnInit, NgModule, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { Curso } from 'src/app/models/curso.model';
import { CursoService } from 'src/app/services/curso.service';
import { CursoAddModule } from 'src/app/curso-add/curso-add.module';
import { Tema } from 'src/app/models/tema.model';
import { TemasService } from 'src/app/services/temas.service';
import { Material } from 'src/app/models/material.model'
import { MaterialService } from 'src/app/services/material.service';
import { Docente } from 'src/app/models/docente.model';
import  {DocenteService } from 'src/app/services/docente.service'
/* import { DatepickerComponent } from 'src/app/components/datepick/datepick.component'; */
import { DatePipe } from '@angular/common';

//
//
//

@Component({
  selector: 'app-curso-add',
  templateUrl: './curso-add.component.html',
  styleUrls: ['./curso-add.component.css'],
  providers: [DatePipe]
})
export class CursoAddComponent implements OnInit{
	
	
curso: Curso = <Curso>{
    nombre: '',
    fechaInicio: new Date(),
    idDocente:0, //campo obligatorio
    tema: { id : 0 //campo obligatorio
        }
  };

 material: Material = <Material>{
  titulo: '',
  costo: 0,
	idCurso: 0,
	stock: 0} 
 
  materiales?: Material[];
  mat?: Material[];
  cursos?: Curso[];
  cursosLista? : Curso[];
  cursosListaTema? : Curso[];
  temas?: Tema[];
  docentes?: Docente[];
  
  //
 // VARIABLES
//

  submitted = false;
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  seleccionNumber : number = 0;
  currentElement: Material = {}
  seleccionado: number = 0;
  dateError = false ;
  
 /* selectedTemaId : number = 0; */
  selectedMaterialId : number = 0;
  selectedDocenteId: number = 0;

  selectedDate: Date | null = null;
  materialSeleccionado : number = 0;
  seleccionadoM : number = 0;
  showDatepick = false;
  ultimoId!: number;

  constructor(private cursoService: CursoService, 
  private materialService: MaterialService, 
  private temaService : TemasService,
  private docenteService : DocenteService,
  private datePipe : DatePipe ) { }
  
  selectedTemaId : number = 0;
  materialesTema?: Material[] = [];
  materialesFiltrados? : Material[] = [];
  
  // 
 // FUNCIONES 
//

  ngOnInit(): void {
	  this.retrieveDocentes()   // CARGA LA LISTA DE DOCENTES
	  this.retrieveTema()		// CARGA LA LISTA DE TEMAS
	  this.retrieveMateriales()} 
  //	  
 // CARGA LA LISTA DE MATERIALES
//

 retrieveDocentes(): void {
    this.docenteService.getAll()
      .subscribe({
        next: (data) => {
          this.docentes = data;
          console.log(this.docentes);},
        error: (e) => console.error(e)});}	  

 retrieveTema(): void {
 this.temaService.getAll()
      .subscribe({
        next: (data) => {
          this.temas = data;
          console.log(this.temas);},
        error: (e) => console.error(e)});       }	  

 retrieveMateriales(): void {
	this.materialService.getAll()
      .subscribe({
        next: (data) => {
          this.materiales = data;
          console.log(this.materiales); },
        error: (e) => console.error(e)});  };
 
 retrieveMaterialesPorCurso(): void {
	this.materialService.obtenerMaterialesPorIdCurso(this.selectedTemaId)
      .subscribe({
        next: (data) => {
          this.materialesTema = data;
          console.log(this.materialesTema);
          console.log("Materiales recuperados:", this.materialesTema); },
        error: (e) => console.error("Materiales no recuperados")});  };

 saveCurso(): void {
	const fechaActual = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');

  if (this.curso.fechaInicio != null && fechaActual != null && this.curso.fechaInicio.toString() < fechaActual) {
     this.dateError = true;
    alert('No puedes seleccionar una fecha menor a la actual.');} 
    
    else {
		
	this.dateError = false;
	const cursoData = {
    "id": this.curso.id,
    "nombre": this.curso.nombre,
    "fechaInicio": this.datePipe.transform(this.curso.fechaInicio,'yyyy-MM-ddTHH:mm'),
    "idDocente": this.curso.idDocente,
    "tema": { id: this.selectedTemaId }};
    this.cursoService.create(cursoData).subscribe({
    next: (res: any) => {
      console.log(res);
      this.submitted = true;
      this.ultimoId = res.id;
    },
    error: (e: any) => {
      console.error(e);} }); }}

 newCurso(): void {
    this.submitted = false;
    this.curso = <Curso>{
    	nombre: '',
    	fechaInicio: new Date(),
    	idDocente:  this.capturar(),
    	tema:  { id : this.selectedTemaId }, };}


 capturar() {
      this.verSeleccion = this.opcionSeleccionado;
      this.capturarNumber();}
  
  
 capturarNumber(){
	this.seleccionNumber = Number (this.verSeleccion) }


  onDateSelect(selectedDate: Date) {
    this.curso.fechaInicio = selectedDate;
     this.showDatepick = false; }


  showDatepicker() {
    this.showDatepick = !this.showDatepicker; }
}

