import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { JsonToStringPipe } from './jsonToString.pipe';
import { KeysPipe } from './keys.pipe';
import { SeparateObjectsPipe } from './separateObjects.pipe';
import { UrlsecurePipe } from './urlsecure.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [			KeysPipe, UrlsecurePipe,
      UrlsecurePipe,
      JsonToStringPipe,
      SeparateObjectsPipe
   ],
  exports:[ KeysPipe, UrlsecurePipe, JsonToStringPipe,SeparateObjectsPipe
  ]
})
export class PipesModule { }
