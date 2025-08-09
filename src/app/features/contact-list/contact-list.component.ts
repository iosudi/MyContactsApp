
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Contact } from '../../core/interfaces/contact';
import { PhonePipe } from '../../core/pipes/phone.pipe';
import { SearchPipe } from '../../core/pipes/search.pipe';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PhonePipe, SearchPipe],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent {
  @Input() contactsList: Contact[] = [];
  searchTerm = '';
  showAddForm = false; // Add this property to control form visibility

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

  private nextId = 4;

  // Form handling
  resetAddForm(form: NgForm): void {
    form.resetForm();
    this.newContact = { name: '', phone: '', email: '' };
    this.showAddForm = false; // Hide form when resetting
  }

  addContact(): void {
    if (!this.isValidContact(this.newContact)) return;
    
    this.contactsList = [
      ...this.contactsList,
      {
        id: this.nextId++,
        ...this.newContact,
        dateAdded: new Date()
      }
    ];
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
    
    if (confirm(`Save changes to ${originalContact.name}?`)) {
      this.contactsList = this.contactsList.map(c => 
        c.id === originalContact.id ? { ...c, ...this.editModel } : c
      );
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
      this.contactsList = this.contactsList.filter(c => c.id !== id);
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
           this.isValidEmail(contact.email);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}