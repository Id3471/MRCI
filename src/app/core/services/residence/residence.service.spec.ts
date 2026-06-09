import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResidenceService } from './residence.service';
import { API_CONFIG } from '../../config/api.config';

describe('ResidenceService', () => {
  let service: ResidenceService;
  let httpMock: HttpTestingController;
  const apiUrl = `${API_CONFIG.baseUrl}/residence`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResidenceService],
    });
    service = TestBed.inject(ResidenceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllResidences', () => {
    it('should fetch all residences', () => {
      const mockResponse = {
        success: true,
        result: [
          { id: 1, nom: 'Résidence Test', email: 'test@test.com', contact: '+237650000000', manager: 'Manager', code: 'ABC123', statut: true }
        ]
      };

      service.getAllResidences().subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.result).toEqual(mockResponse.result);
      });

      const req = httpMock.expectOne(`${apiUrl}/list`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getResidenceById', () => {
    it('should fetch a residence by id', () => {
      const residenceId = 1;
      const mockResponse = {
        success: true,
        result: { id: 1, nom: 'Résidence Test', email: 'test@test.com', contact: '+237650000000', manager: 'Manager', code: 'ABC123', statut: true }
      };

      service.getResidenceById(residenceId).subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.result).toEqual(mockResponse.result);
      });

      const req = httpMock.expectOne(`${apiUrl}/${residenceId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createResidence', () => {
    it('should create a residence', () => {
      const mockData = {
        denomination: 'Résidence Test',
        contact: '650000000',
        email: 'test@test.com',
        manager: 'Manager',
        full_phone: '+237650000000'
      };

      const mockResponse = {
        success: true,
        result: { id: 1, nom: 'Résidence Test', email: 'test@test.com', contact: '+237650000000', manager: 'Manager', code: 'ABC123', statut: true }
      };

      service.createResidence(mockData).subscribe((response) => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/create`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });
});
