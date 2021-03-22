import { Directive, ElementRef, HostBinding, HostListener, OnInit } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit {
    @HostBinding('class.open') isOpen: boolean;

    constructor (private elementRef: ElementRef)
    {}

    ngOnInit(): void {
        this.isOpen = false;
    }

    @HostListener('document:click', ['$event']) toggleOpen(eventData: Event) {
        this.isOpen = this.elementRef.nativeElement.contains(eventData.target) ? !this.isOpen : false;
    }
    
}