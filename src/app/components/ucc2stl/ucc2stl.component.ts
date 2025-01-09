import { Component, inject } from '@angular/core';
import { Ucc2stlService } from '../../shared/services/ucc2stl.service';
import { dense_w_cuboids } from '../../shared/helpers';
import { CuboidComplex } from '../../shared/helpers';
import { forkJoin } from 'rxjs';
import {StlModelViewerComponent, StlModelViewerModule} from "angular-stl-model-viewer"

@Component({
  selector: 'app-ucc2stl',
  standalone:true,
  imports: [StlModelViewerModule],
  templateUrl: './ucc2stl.component.html',
  styleUrl: './ucc2stl.component.css'
})
export class Ucc2stlComponent {
  ucc2stlService = inject(Ucc2stlService)

  density: string = '';
  connectivity: string = '';
  node: string = '';
  stlData: string = '';

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
        const complex = new CuboidComplex(cuboids);

        console.log(`Done. There are ${complex.cuboids.size} "dense" cuboids.`);
        console.log("Starting outer shell caclulations ...");
        complex.shell();
        console.log(
            `Done. There are ${complex.vertices.size} vertices and ${complex.triangles.length} triangles.`
        );
        let textFile: string | null = null;
        const makeTextFile = function (text: BlobPart) {
            let data = new Blob([text], { type: "text/plain" });
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }
            textFile = window.URL.createObjectURL(data);
            return textFile;
        };
        this.stlData = makeTextFile(complex.stl);
        // this.stlData = complex.stl;
        console.log("1>>",this.stlData);
        console.log("2>>",complex.stl);
        // var stl_viewer = new StlViewer(document.getElementById("stl_cont"), {
        //     models: [{ id: 0, filename: tralala, display: "wireframe" }],
        // });

    });
  }
}
