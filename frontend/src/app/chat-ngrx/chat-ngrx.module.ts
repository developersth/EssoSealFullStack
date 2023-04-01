import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { StoreModule } from '@ngrx/store';

import { VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule } from 'ngx-videogular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ChatNGRXRoutingModule } from "./chat-ngrx-routing.module";

import { ChatComponent } from "./chat-ngrx.component";
import { chatReducer } from '../chat-ngrx/store/chat.reducers';


@NgModule({
    imports: [
        CommonModule,
        ChatNGRXRoutingModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        PerfectScrollbarModule,
        StoreModule.forFeature('chat', chatReducer),
    ],
    declarations: [
        ChatComponent
    ]
})
export class ChatNGRXModule { }
