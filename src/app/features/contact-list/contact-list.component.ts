
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Contact } from '../../core/interfaces/contact';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { DateFormatPipe } from '../../core/pipes/date.pipe';

import { ContactItemComponent } from '../contact-item/contact-item.component';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchPipe,DateFormatPipe, ContactItemComponent],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent {
  @Input() contactsList: Contact[] = [];
  @Output() add = new EventEmitter<Omit<Contact, 'id' | 'dateAdded'>>();
  @Output() update = new EventEmitter<Contact>();
  @Output() delete = new EventEmitter<number>();
  searchTerm = '';
  showAddForm = false; // Add this property to control form visibility
  phonePattern = /^(010|011|012|015)\d{8}$/;


  // Form models
  newContact: Omit<Contact, 'id' | 'dateAdded'> = {
    name: '',
    phone: '',
    email: ''
  };

  // Edit state
  editingId: number | null = null;
  editModel: Omit<Contact, 'id' | 'dateAdded'> = {
    name: '',
    phone: '',
    email: ''
  };

  // Form handling
  resetAddForm(form: NgForm): void {
    form.resetForm();
    this.newContact = { name: '', phone: '', email: '' };
    this.showAddForm = false; // Hide form when resetting
  }

  addContact(): void {
    if (!this.isValidContact(this.newContact)) return;
    const { name, phone, email } = this.newContact;

    
    this.add.emit({ name: name.trim(), phone: phone.trim(), email: email.trim() });

    this.resetAddForm(new NgForm([], []));
    this.showAddForm = false; // Hide form after adding
  }

  // Edit handling
  startEdit(contact: Contact): void {
    this.editingId = contact.id;
    this.editModel = { ...contact };
    this.showAddForm = false; // Ensure add form is hidden when editing
  }

  saveEdit(originalContact: Contact): void {
    if (!this.editingId || !this.isValidContact(this.editModel)) return;
    const { name, phone, email } = this.editModel;
    
    if (confirm(`Save changes to ${originalContact.name}?`)) {
      this.update.emit({ ...originalContact, name: name.trim(), phone: phone.trim(), email: email.trim() });
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editModel = { name: '', phone: '', email: '' };
  }

  // Delete handling
  deleteContact(id: number): void {
    if (confirm('Delete this contact?')) {
      this.delete.emit(id);
      if (this.editingId === id) this.cancelEdit();
    }
  }

  // Helpers
  trackById(index: number, contact: Contact): number {
    return contact.id;
  }

  private isValidContact(contact: { name: string; phone: string; email: string }): boolean {
    return !!contact.name?.trim() && 
           !!contact.phone?.trim() &&
           this.isValidPhone(contact.phone) &&
           this.isValidEmail(contact.email);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isValidPhone(phone: string):boolean{
    return /^(010|011|012|015)\d{8}$/.test(phone);
  }
}