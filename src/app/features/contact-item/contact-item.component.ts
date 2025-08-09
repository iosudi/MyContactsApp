import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../../core/interfaces/contact';
import { PhonePipe } from '../../core/pipes/phone.pipe';

@Component({
  selector: 'tr[app-contact-item]', 
  standalone: true,
  imports: [CommonModule, PhonePipe],
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.css'
})
export class ContactItemComponent {
  @Input({ required: true }) contact!: Contact;
  @Output() edit = new EventEmitter<Contact>();
  @Output() delete = new EventEmitter<number>();

  onEdit()   { this.edit.emit(this.contact); }
  onDelete() { this.delete.emit(this.contact.id); }
}
