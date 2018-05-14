import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'club' })
export class ClubPipe implements PipeTransform {

    transform(value: string): string {
        switch (value) {
            case 'I':
                return 'Fer';
            case 'W':
                return 'Bois';
            case 'S':
                return 'SandWedge';
            case 'P':
                return 'Putter';
            case 'D':
                return 'Driver';
            case 'J':
                return 'Pitch';
            case 'H':
                return 'Hybrid';
            default:
                return 'Autres';
        }
    }
}