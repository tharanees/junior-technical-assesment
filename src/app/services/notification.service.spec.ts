import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NotificationService', () => {
    let service: NotificationService;
    let snackBarSpy: jest.Mocked<MatSnackBar>;

    beforeEach(() => {
        const mockSnackBar: Partial<jest.Mocked<MatSnackBar>> = {
            open: jest.fn()
        };

        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            providers: [
                NotificationService,
                { provide: MatSnackBar, useValue: mockSnackBar as jest.Mocked<MatSnackBar> }
            ]
        });

        service = TestBed.inject(NotificationService);
        snackBarSpy = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should display an error notification', fakeAsync(() => {
        service.showError('Test Error');
        tick(3000);
        expect(snackBarSpy.open).toHaveBeenCalledWith('Test Error', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
        });
    }));

    it('should display a success notification', fakeAsync(() => {
        service.showSuccess('Test Success');
        tick(3000);
        expect(snackBarSpy.open).toHaveBeenCalledWith('Test Success', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
        });
    }));
});
