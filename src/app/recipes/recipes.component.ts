import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DataStorageService} from "../shared/data-storage.service";

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
})

export class RecipesComponent implements OnInit {

  constructor(private route: ActivatedRoute, private dataStorage: DataStorageService) {
  }

  ngOnInit() {
    const currentUser = (this.route.snapshot.data['currentUser']);
    this.dataStorage.currentUser.next(currentUser);
    this.dataStorage.fetchBookmarks();
  }




}
