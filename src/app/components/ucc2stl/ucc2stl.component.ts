import { Component, inject, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { Ucc2stlService } from '../../shared/services/ucc2stl.service';
import { dense_w_cuboids } from '../../shared/helpers';
import { CuboidComplex } from '../../shared/helpers';
import { forkJoin } from 'rxjs';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  AmbientLight,
  Mesh,
  MeshNormalMaterial,
  BufferGeometry,
  BufferAttribute,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-ucc2stl',
  standalone:true,
  imports: [],
  templateUrl: './ucc2stl.component.html',
  styleUrl: './ucc2stl.component.css'
})
export class Ucc2stlComponent implements OnInit {
  @ViewChild("rendererContainer", { static: true }) rendererContainer!: ElementRef;

  ucc2stlService = inject(Ucc2stlService)

  density: string = '';
  connectivity: string = '';
  node: string = '';
  
  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private controls!: OrbitControls;
  private stlData!: string;

  private parseSTL(data: string): BufferGeometry {
    const vertices: number[] = [];
    const lines = data.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("vertex")) {
        const [, x, y, z] = line.split(/\s+/).map(Number);
        vertices.push(x, y, z);
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(vertices), 3));
    return geometry;
  }

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

        this.stlData = complex.stl;
        console.log(this.stlData);

        this.scene = new Scene();

        // Camera
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // this.camera.position.z = 10;
        this.camera.position.set(0, 0, 20);

        // Renderer
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xeeeeee); // Light gray background
        this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // Smooth movement
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;

        // Light
        const ambientLight = new AmbientLight(0xffffff, 0.5); // Soft white light
        this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10).normalize();
        this.scene.add(directionalLight);

        // Parse the STL data
        const geometry = this.parseSTL(this.stlData);

        // Create the mesh
        const material = new MeshNormalMaterial();
        const mesh = new Mesh(geometry, material);
        this.scene.add(mesh);

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          // mesh.rotation.x += 0.01;
          // mesh.rotation.y += 0.01;
          this.controls.update(); // Required for damping to work
          this.renderer.render(this.scene, this.camera);
        };
        animate();

    });
  }

  downloadSTL(): void {
    // Ensure valid ASCII STL formatting
    const stlHeader = "solid Model\n";
    const stlFooter = "endsolid Model";
    
    // Combine header, data, and footer
    const stlContent = `${stlHeader}${this.stlData.trim()}\n${stlFooter}`;
    
    const blob = new Blob([stlContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "model.stl"; // Filename
    a.click();

    URL.revokeObjectURL(url); // Cleanup
  }
  
}
