import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChambreService } from './chambre.service';
import { API_CONFIG } from '../../config/api.config';

describe('ChambreService', () => {
  let service: ChambreService;
  let httpMock: HttpTestingController;
  const baseUrl = `${API_CONFIG.baseUrl}/chambre`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChambreService],
    });
    service = TestBed.inject(ChambreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all chambres', () => {
    const mockResponse = { success: true, result: [] };

    service.getAllChambres().subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.result).toEqual([]);
    });

    const req = httpMock.expectOne(`${baseUrl}/list`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch chambre by id', () => {
    const id = 1;
    const mockResponse = { success: true, result: { id, code: 'CH-123', prix: 25000, statut: true, description: 'Test', longitude: 3.83, latitude: 11.5, adresse: 'Rue Principale', rue: 'Rue des Fleurs', image_principale: 'image1.jpg' } };

    service.getChambreById(id).subscribe(response => {
      expect(response.success).toBe(true);
      expect((response.result as any).id).toBe(id);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
