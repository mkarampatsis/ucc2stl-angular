import { Component, inject } from '@angular/core';
import { Ucc2stlService } from '../../shared/services/ucc2stl.service';
import { dense_w_cuboids } from '../../shared/helpers';
import { CuboidComplex } from '../../shared/helpers';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ucc2stl',
  imports: [],
  templateUrl: './ucc2stl.component.html',
  styleUrl: './ucc2stl.component.css'
})
export class Ucc2stlComponent {
  ucc2stlService = inject(Ucc2stlService)

  density: string = '';
  connectivity: string = '';
  node: string = '';

  ngOnInit(){
    forkJoin({
      density: this.ucc2stlService.getDensity(),
      connectivity: this.ucc2stlService.getConnectivity(),
      node: this.ucc2stlService.getNode(),
    }).subscribe(({ density, connectivity, node }) => {
      this.density = density;
      this.connectivity = connectivity;
      this.node = node;
  
      // Now call dense_w_cuboids after all data is available
      const cuboids = dense_w_cuboids(this.node, this.connectivity, this.density, 0.3);
      console.log('Cuboids:', cuboids);
  
      const complex = new CuboidComplex(cuboids);
      console.log('Complex:', complex);
      console.log(`Done. There are ${complex.cuboids.size} "dense" cuboids.`);
      console.log("Starting outer shell caclulations ...");
      complex.shell();
      console.log(
        `Done. There are ${complex.vertices.size} vertices and ${complex.triangles.length} triangles.`
      );
    });
  }
}
