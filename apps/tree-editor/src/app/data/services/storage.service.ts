import { Injectable } from '@angular/core';
import { NodeGroup } from '../../editor/drawing/models/node-group.model';
import { SPNode } from '../models/sp-node.model';
import { DataExport } from '../utils/data-export.util';

@Injectable()
export class StorageService {
  private readonly treeKey = 'tree_key';

  constructor() {}

  save(root: NodeGroup) {
    const data = DataExport.convert(root);
    localStorage.setItem(this.treeKey, JSON.stringify(data));
  }

  load(): SPNode {
    const data = localStorage.getItem(this.treeKey);
    return JSON.parse(data) as SPNode;
  }
}
